ishml.Phrase =class Phrase
{
	constructor(...precursor) 
	{
		Object.defineProperty(this,"_context",{value:this,writable:true})
		
		Object.defineProperty(this,"_seed",{value:ishml.util.random().seed,writable:true})
		Object.defineProperty(this,"text",{value:"",writable:true})
		if (precursor.length===1)
		{
			if (precursor[0] instanceof ishml.Phrase)
			{
				Object.defineProperty(this,"_precursor",{value:precursor[0],writable:true})
				Object.defineProperty(this,"_phrases",{value:[],writable:true})
				this.contextualize()
				return this
			}
			if (typeof precursor[0] === "function")
			{	
				//custom function must return a phrase
				Object.defineProperty(this,"_precursor",{value:precursor[0](),writable:true})
				Object.defineProperty(this,"_phrases",{value:[],writable:true})
				this.contextualize()
				return this
			}
			//else treat as text.
			Object.defineProperty(this,"_precursor",{value:null,writable:true})
			Object.defineProperty(this,"_phrases",{value:[],writable:true})
			this.populate(...precursor)
			return this
		}
		else
		{
			Object.defineProperty(this,"_precursor",{value:null,writable:true})
			Object.defineProperty(this,"_phrases",{value:[],writable:true})
			if (precursor.length !== 0){this.populate(...precursor)}
			return this
		}	
	}
	append(documentSelector="#story")
	{
		var targetNodes = document.querySelectorAll(documentSelector)
		targetNodes.forEach(node=>node.append(this.htmlTemplate().content))
		return this
	}
	contextualize(innerPhrase)
	{
		var precursor =innerPhrase ?? this._precursor
		if (precursor===null){return this}  //end of the line
		precursor._context=this._context
		if (precursor._precursor){precursor.contextualize(precursor._precursor)}
		Object.assign(this,precursor) //capture tags
		return this
	}
	else(literals,...expressions)
	{
		var alternativePhrase=new ishml.Phrase(literals,...expressions)
		return new class elsePhrase extends ishml.Phrase
		{
			generate()
			{
				var phrases=this._precursor.generate()
				if (this._precursor.text==="")
				{
					var phrases=alternativePhrase.generate()
					this.text=alternativePhrase.text
				}
				else {this.text=this._precursor.text}
				return phrases
			}
		}(this)
	}
	generate()
	{
		this._phrases=this._precursor?.generate() ?? this._phrases
		var evaluation=[]
		this._phrases.forEach((phrase,index)=>
		{
			var clause=phrase.value
			var clauseType=typeof clause
			if (clauseType=== "string"  || clauseType=== "number")  //value is string
			{
				var data =Object.assign({},phrase) //grab the meta data and data already gathered
				data.value=clause.toString()
				
			}
			else
			{
				if (clauseType==="function")  
				{
						clause=clause(this)  //evaluate to string, number, or ishml Phrase
				}		
				if (clause instanceof ishml.Phrase) //clause is an ishml_phrase
				{
					var data={}
					var subPhrases=clause.generate()
					data.value= subPhrases.map(subPhrase=>subPhrase.value).join("")
				}
				else
				{
					data={value:clause.toString()}
				}
				
			}
			var evaluatedPhrase=Object.assign({},data)
			evaluation.push(evaluatedPhrase)
		})
		
		this.text=evaluation.map(data=>data.value).join("")
		return evaluation
	}
	first(count=1)
	{
		return new class firstPhrase extends ishml.Phrase
		{
			generate()
			{
				var phrases=this._precursor.generate().slice(0,count)
				this.text=phrases.map(phrase=>phrase.value).join("")
				return phrases
			}
		}(this)
	}
	htmlTemplate()
	{
		var template = document.createElement("template")
		template.innerHTML = this.text
		return template
	}
	if(condition)
	{
		if (typeof condition ==="function"){var rule=condition}
		else {var rule = ()=>condition}
		return new class ifPhrase extends ishml.Phrase
		{
			generate()
			{
				var phrases=this._precursor.generate()
				if(rule(this._context))
				{
					this.text=this._precursor.text
					return phrases
				}
				else
				{
					this.text=""
					return []
				}
			}
		}(this)
	}
	last(count=1)
	{
		return new class lastPhrase extends ishml.Phrase
		{
			generate()
			{
				var phrases=this._precursor.generate().slice(-count)
				this.text=phrases.map(phrase=>phrase.value).join("")
				return phrases
			}
		}(this)
	}
	modify(modifier)
	{
		return new class transformPhrase extends ishml.Phrase
		{
			generate()
			{
				var phrases=this._precursor.generate().map(phrase=>
				{
					var modifiedPhrase=Object.assign({},phrase)
					modifiedPhrase.value=modifier(phrase.value)
					return modifiedPhrase
				})	
				this.text=phrases.map(phrase=>phrase.value).join("")
				return phrases
			}
		}(this)
	}
	per(id)
	{
		var tag=id
		return new class ifPhrase extends ishml.Phrase
		{
			generate()
			{
				var revisedPhrases=[]
				do 
				{
					var phrases=this._precursor.generate()
					revisedPhrases=revisedPhrases.concat(phrases)
				}while(!this._context[tag].reset)
				this.text=revisedPhrases.mape(data=>data.value).join("")
				return revisedPhrases		
			}
	}(this)
	}
	prepend(documentSelector="#story")
	{
		var targetNodes = document.querySelectorAll(documentSelector)
		targetNodes.forEach(node=>node.prepend(this.htmlTemplate().content))
	}
	populate(literals, ...expressions)
	{
		var data=[]
		
		if (literals)
		{
			var index=1
			if( literals.hasOwnProperty("raw"))
			{
				if (expressions.length===0)  //_`blah`
				{
					data=literals
				}
				else //_`blah${}blah` interleave literals into expressions.
				{
					
					if(expressions.length>0)
					{
						var interleaving=expressions.reduce((interleaving,expression)=>
						{
							interleaving.push({value:expression})
							if (literals[index].length>0)
							{
								interleaving.push({value:literals[index]})
							}
							index++
							return interleaving
						},[])
						
					}
					
					if (literals[0].length !== 0)
					{
						interleaving.unshift(literals[0])
					
					}
					if (index < literals.length)
					{
						interleaving=interleaving.concat(literals.slice(index))
					}
					data=interleaving
				}
			}
			else //function call notation
			{
				if (expressions.length >0 ) // data is simple list of args
				{
					data=[literals].concat(expressions)
				}	
				else  
				{
					if (literals instanceof Array)//_(["blah","blah",_()])
					{
						data=literals
					}
					else //_("blah") or _(_()) _(), {}
					{
						if(literals){data=[literals]}
						else {data=[]}
						
					}
				}
			}
		}				
		if (data instanceof Array) //normalize array and replace _phrases
		{
			if (data.length===0){this._phrases=[]}
			else
			{
				this._phrases=data.map(phrase=> //normalize phrases
				{
					var phraseType=typeof phrase
					if (phraseType ==="object")
					{
						if (phrase instanceof ishml.Phrase)
						{
							return {value:phrase}
						}
						else
						{
							if (phrase.hasOwnProperty("value")){return phrase}
							else 
							{
								var revisedPhrase=Object.assign({},phrase)
								revisedPhrase.value=Object.values(phrase)[0]
								return revisedPhrase
							}
						}
					}
					else
					{
						if (phraseType==="function")
						{
							return {value:phrase}
						}
						if (phraseType === "string"){return {value:phrase}}
						else{return{value:phrase.toString()}}
					}
				})
				this._phrases.forEach(phrase=>
				{
					if (phrase.value instanceof ishml.Phrase)
					{
						this.contextualize(phrase.value)
					}
				})
			}	
		}
		else  //object  attempt to match to tags  //DEFECT Review
		{
			Object.keys(this).forEach(key=>
			{
				if (data.hasOwnProperty(key))
				{
					this[key](data[key])
				}	
			})
		}
		return this
	}
	replace(documentSelector="#story")
	{
		var targetNodes = document.querySelectorAll(documentSelector)
		targetNodes.forEach(node=>
		{
			while(node.firstChild){node.removeChild(node.firstChild)}
			node.append(this.htmlTemplate().content)
		})
		return this
	}	
	_reset()
	{ 
		this._precursor?._reset()
		return this
	}
	say(seed) //generates text output
	{
		
		if (seed>=0)
		{
			this.seed(seed)
		}
		this.generate()
		return this
	}
	seed(seed) //generates text output
	{
		if (seed>=0 && seed <1){this._seed=Math.floor(seed* 2147483648)}
		else
		{
			if(!seed){this._seed=ishml.util.random().seed}
			else{this._seed=seed}
		}
		if (this._precursor){this._precursor.seed(this._seed)}
		this._phrases.forEach(phrase=>
		{
			if(phrase.value instanceof ishml.Phrase)
			{
				phrase.value.seed(ishml.util.random(this._seed).seed)
			}	
		})
		return this
	}
	tag(id)
	{
		this._context[id]=this
		return this
	}
	transform(transformer)
	{
		return new class transformPhrase extends ishml.Phrase
		{
			generate()
			{
				var phrases=transform(this._precursor.generate())
				this.text=phrases.map(phrase=>phrase.value).join("")
				return phrases
			}
		}(this)
	}
}
ishml.Phrase.prototype.then=ishml.Phrase.prototype.else
