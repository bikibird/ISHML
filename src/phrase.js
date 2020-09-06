/*
***anonoymous phrases:
var saying=ishml.Phrase`The ${ishml.Phrase(["cat","dog", "bird"]).pick()} is in the ${ishml.Phrase(["hat","box", "nest", "car"]).pick(})}.`

saying.say().text


var _=ishml.PHrase
var example1=_`The ${_(["cat","dog", "bird"]).pick()} is in the ${_(["hat","box", "nest"]).pick(})}.`
example1.say().text

***Refering to phrases

var example2=_`The ${{animal:_(["cat","dog", "bird"]).pick()}} is in the ${{container:_(["hat","box", "nest","car"]).pick()}}.`
example2.say().text
example2.say({animal:["hippo","flea","moose"],container:["woods", "water", "matchbox"]}).text
example2.say({animal:["otter", "fox", "werewolf"]}).text  //partial
example2.say(["hippo","flea","moose"],["woods", "water", "matchbox"]}).text
example2({animal:["hippo","flea","moose"],container:["woods", "water", "matchbox"]})
example2.say().text

var example3=_`The ${animal:_().pick()} is in the ${container:_``).pick(})}.`
example3({animal:["hippo","flea","moose"],container:["woods", "water", "matchbox"]}).say().text

***Reusable phrases

var saying=()=>_`The ${animal:_(["cat","dog", "bird"]).pick()} is in the ${container:_(["hat","box", "nest","car"]).pick(})}.`
var example4 =saying()
var example5 =saying()({animal:["hippo","flea","moose"],container:["woods", "water", "matchbox"]})
example4.say().text
example5.say().text

***Details of next

var saying=_`You may choose a ${{animals:animals.join({separator:" "})}}. You chose a ${{animal:animals.pick()}}`

Named phrases:
var a=ishml.Phrase`There is ${{animal:ishml.Phrase(["cat","dog", "bird"]).pick().cap()}} in ${{container:ishml.Phrase(["hat","box", "nest"]).cap().join({separator:", "})}}.`

Data subsitution:
a({animal:[{value:"baboon",size:5},{value:"flea",size:1},{value:"badger",size:3}],container:[{value:"shoebox",size:1},{value:"bed",size:5},{value:"cave",size:5}]}).text()

var a=ishml.Phrase`There is ${{animal:ishml.Phrase([{value:"baboon",size:5},{value:"flea",size:1},{value:"badger",size:3}]).pick().cap()}} in ${ishml.Phrase.if(a.animal.size<2)`hat`.else`house`}.`

var a=ishml.Phrase`There is ${{animal:ishml.Phrase([{value:"baboon",size:5},{value:"flea",size:1},{value:"badger",size:3}]).pick().cap()}} in ${ishml.Phrase.if(a.animal.size<2)`hat`.else`house`}.`

a=ishml.Phrase`<list>${{item:ishml.Phrase`<li>${{animal:ishml.Phrase(["cat","dog","bird"])`}}</li>}`.repeat(a.item.animal)}</list>`

factory function:

var a=()=>ishml.Phrase`There is ${{animal:ishml.Phrase(["cat","dog", "bird"]).pick()}} in ${{container:ishml.Phrase(["hat","box", "nest"]).pick()}}.`
var b=a()
var c=a()

Conditional:

var a=ishml.Phrase`There is a ${{animal:ishml.Phrase(["cat","dog", "bird"]).pick()}}${{container:" in a hat", if:(root)=>root.animal.value==="cat",else:" in the house"}}.`

var a=ishml.Phrase`There is a ${{animal:ishml.Phrase(["cat","dog", "bird"]).pick()}} in ${{container:"a hat", if:(root)=>root.animal.value==="cat"}}.`

Silent:
var a=ishml.Phrase`There is something ${{animal:ishml.Phrase(["cat","dog", "bird"]).pick(),silent:" "}} in ${{container:"a hat", if:()=>a.animal.value==="cat",else:"the house"}}.`

Looping

var _ =ishml.Phrase //easier to type and read.

var items = _`<li>${{li:_(["cat","dog", "bird"]).pick()}}</li>`.until(x=>x.li.reset)
var items = _`<li>${{li:_(["cat","dog", "bird"]).pick()}}</li>`.while(x=>!x.li.reset)

factory functions

var items = data=>_`<li>${{li:_(data).pick()}}</li>`.until(x=>x.li.reset)

inline data:
var a=_`The ${{animal:ishml.Phrase(["cat","dog","bird"]).pick()}} is in the ${{container:_(["hat","box","nest","house","burrow","bag"]).pick()}}.`
a.say().text	

var animals=["cat","dog","bird"]
var containers=["hat","box","nest","house","burrow","bag"]
var a=_`The ${{animal:ishml.Phrase(animals).pick()}} is in the ${{container:_(containers).pick()}}.`
a.say().text


complex data:
var data={
		animal:["cat","dog","bird"],
		container:["hat","box","nest","house","burrow","bag"]
	}
var a=_`The ${{animal:_().pick()}} is in the ${{container:_().pick()}}.`

a.say(data).text

a(data)  //set data without generating text

Simple Correlated Phrases:
var data={animal:
	[
		{value:"cat", container:"hat"},
		{value:"dog", container:"house"},
		{value:"bird", container:"nest"}
	]}
var a=_`The ${{animal:_``.pick()}} is in the ${{container:x=>x.animal.container}}.`
a.say(data)

var a=_`The ${{animal:_().pick()}} is in the ${{container:()=>a.animal.container}}.`
a.say(data)

Complex correlated phrases:
 (DEFECT: need to implement random for this example.)
var data={animal:
	[
		{value:"cat", container:["hat","bag","box"]},
		{value:"dog", container:["house","burrow","car"]},
		{value:"bird", container:["nest","tree","sky"]}
	]}


var a=_`The ${{animal:ishml.Phrase``.pick()}} is in the ${{container:x=>_``.pick()(x.animal.container)}}.`

var container=ishml.Phrase``.join({separator:" "})
var a=ishml.Phrase`The ${{animal:ishml.Phrase``.pick()}} is in the ${{container:x=>container(x.animal.container)}}.`

a.say(data)
{li:"cat", list:["hat","bag","box"]},
		{li:"dog", list:["house","burrow","car"]},
		{li:"bird", list:["nest","tree","sky"]}

Self nesting phrases:
  -- simple list
var data={items:{li:["cat","dog","bird"]}}
var items=()=>ishml.Phrase`<li>${{li:ishml.Phrase().pick()}}</li>`.until(x=>x.li.reset)
var list=()=>ishml.Phrase`<ol>${{items:items()}}</ol>`

var a=list()(data)
var a=list();a(data)



//outer most phrase has 


  -- self nesting list:

var _=ishml.Phrase
var list=()=>_`<ol>${{items:_`<li>${{li:_().pick()}}${{list:x=>list()(x.li.list),if:x=>x.li.list}}</li>`.until(x=>x.li.reset)}}</ol>`
var data={items:{li:[{value:"cat",list:{items:{li:["meow","howl"]}}},{value:"dog",list:{items:{li:["bark","howl"]}}},{value:"bird",list:{items:{li:["coo","peep"]}}}]}}

---with hoisting

var items=()=>ishml.Phrase`<li>${{li:ishml.Phrase().pick()}}${{list:x=>list()(x.li.list),if:x=>x.li.list}}</li>`.until(x=>x.li.reset)
var list=()=ishml.Phrase`<ol>${{items:items()}}</ol>`
var data={items:{li:[{value:"cat",list:{items:{li:["meow","howl"]}}},{value:"dog",list:{items:{li:["bark","howl"]}}},{value:"bird",list:{items:{li:["coo","peep"]}}}]}}


---with sublist

var _=ishml.Phrase
var sublist={list:x=>list()(x.li.list),if:x=>x.li.list}
var items=()=>ishml.Phrase`<li>${{li:ishml.Phrase().pick()}}${sublist}</li>`.until(x=>x.li.reset)
var list=()=>ishml.Phrase`<ol>${{items:items()}}</ol>`
var data={items:{li:[{value:"cat",list:{items:{li:["meow","howl"]}}},{value:"dog",list:{items:{li:["bark","howl"]}}},{value:"bird",list:{items:{li:["coo","peep"]}}}]}}

var _=ishml.Phrase
var list=()=>_`<ol>${{items:items()}}</ol>`
var items=()=>_`<li>${{li:ishml.Phrase().pick()}}${sublist}</li>`.until(x=>x.li.reset)
var sublist={list:x=>list()(x.li.list),if:x=>x.li.list}
var data={items:{li:[{value:"cat",list:{items:{li:["meow","howl"]}}},{value:"dog",list:{items:{li:["bark","howl"]}}},{value:"bird",list:{items:{li:["coo","peep"]}}}]}}


---comma list
var _=ishml.Phrase
var oxfordList=()=>_`${{item:_().pick()}}${{separator:", ", if:x=>x.item.index < x.item.total-1 && x.item.total>2}}${{separator:" and ", if:x=>x.item.index===0 && x.item.total===2}}${{separator:"and ", if:x=>x.item.index===x.item.total-2 && x.item.total>2}}`.until(x=>x.item.reset)

data={item:["cat","dog","bird","horse"]}

var data=["cat","dog","bird","horse"]
var animals=`Today I went to the country and saw a ${oxfordList({item:["cat","dog","bird","horse"]})} by the river.`

var list=(data,oxford=true)=>
{
	if(oxford)
	{
		var list=_`${{item:_().pick()}}${{separator:", ", if:x=>x.item.index < x.item.total-1 && x.item.total>2}}${{separator:" and ", if:x=>x.item.index===0 && x.item.total===2}}${{separator:"and ", if:x=>x.item.index===x.item.total-2 && x.item.total>2}}${{nothing:"nothing", if:x=>x.item.value===""}}`.until(x=>x.item.reset)
	}
	else
	{
		var list=_`${{item:_().pick()}}${{separator:", ", if:x=>x.item.index < x.item.total-2 && x.item.total>2}}${{separator:" and ", if:x=>x.item.index === x.item.total-2 && x.item.total>1}}${{nothing:"nothing", if:x=>x.item.value===""}}`.until(x=>x.item.reset)
	}	
	if(data)
	{
		return list(data)
	}
	else
	{
		return list
	}
}

---options for pick:
randomPick({curve:(index,total)=>({min:index/total, max:(index+1)/total}),seed,cycle=(total)=>total, last:"" )
pick({curve:(index,total)=>{min:index/total, max:(index+1)/total},cycle=(total)=>total, last:ishml.enum.random)

last: "string" or function or ishml.enum.reset
pick({curve:(index,total)=>({min:index/total, max:(index+1)/total}),seed,cycle=(total)=>total, last:"" )

.shuffle().pick()


uniformRandom=(x)=>
{
	return Math.floor(Math.random()*x.total)
}

pick({curve:(index,total)=>({min:index/total, max:(index+1)/total}),seed,cycle=Infinity, last:"" )

pick({curve:(index,array)=>index,reset=(index,array)=>index===array.length, seed,last:(index,array)=>array[array.length-1]})

curve: a function that returns an index into the array.
cycle: how many times to repeat. Defaults to Infinity. May be number or function.
last: The value to return once cycle completes.  defaults to "", may also be function
seed: random number

---Other transforms:

.shuffle({seed:.01})
.sort({compare:(a,b)=>a.item.weight > b.item.weight})
.filter({select:=>(x)=>x.weight> 10})
.first(value=1)
.last(value=1)
})

prefixes and suffixes

_.prefix(ishml.lang.a).named("a")
_.prefix(ishm.lang.an).named("an")
_.prefix(x=>toUpperCase(x)).named("cap")
_.prefix(x=>x+"ing").named("cap")
var a=_`I saw ${_.cap.an(["otter","zebra","penguin"].pick())} ${_(["walk,sleep,eat"]).pick().ing} at the zoo.`

cap(an([]))

*/
ishml.Phrase=function Phrase(literals, ...expressions)
{
	var phrases=[]
	var concordance={key:{},index:{}}
	
	if (literals && literals.length>0)
	{
		if (literals[0].length !== 0)
		{
			
			phrases.push({value:literals[0]})
			
		}
		var index=1
		expressions.forEach(phrase=> //{animal:"cat",if:()=>true, else:"dog"} {ishml.phrase or function,if,else}, ishml.phrase or function
		{
			
			if (typeof phrase === "object")  //phrase is an object. AKA named phrase
			{
				var key=Object.keys(phrase)[0]
				var normalizedPhrase=Object.assign({value:phrase[key]},phrase)
				var counter=phrases.push(normalizedPhrase)-1
				concordance.index[counter]=key
				concordance.key[key]=counter
			}
			else //anonymous phrase
			{phrases.push({value:phrase})}
			if (literals[index].length>0)
			{
				phrases.push({value:literals[index]})
			}
			index++
		})
		if (index < literals.length)
		{
			phrases=phrases.concat(literals.slice(index).map(literal=>({value:literal})))
		}
		
	}	
	var ishml_phrase=function(...data)
	{
		populate=(data,index)=>
		{
			if (data instanceof Array) //if array and this phrase terminal, replace phrases with normalized data array.
			{
				if (ishml_phrase.terminal)
				{
					if (data.length===0){phrases=[]}
					else
					{
						phrases=data.map(phrase=> //normalize phrases
						{
							if (typeof phrase === "string"){return {value:phrase}}
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
						})
					}	
				}
				else  //this phrase non-terminal, but using anonymous data.  Match to nth entry in the concordance.
				{
					if(!(data===ishml.enum.mode.reset))
					{
						var key=Object.values(concordance.index)[index]
						phrases[concordance.key[key]].value(data)
					}	
				}	
			}
			else
			{
				if(!(data===ishml.enum.mode.reset))  //if data is an object, match members to named phrases
				{
					Object.keys(data).forEach(key=>
					{
						if(concordance.key.hasOwnProperty(key))
						{
							phrases[concordance.key[key]].value(data[key])
						}

					})
				}	
			}
		}
		if (data.length>0)  //we have data
		{			
			data.forEach((item,index)=>
				{
					if(item._isIshmlPhrase)
					{
						var phrases=[item.say().text]
						populate(phrases,index)
					}
					else {populate(item,index)}
					
				}
			)	

			return ishml_phrase
			
		}
		else 
		{
			var evaluation=[]
			//convert phrases into an array of {value:string, whatever:whatever}
			phrases.forEach((phrase,index)=>
			{
				//phrase.value is either a string, a function, ishml.Phrase, any of which must be evaluated  Phrase.whatever must be captured {value:evaluation, whatever}
				
				if (phrase.hasOwnProperty("if"))
				{
					if (phrase.if(ishml_phrase))
					{
						var clause=phrase.value
					}
					else
					{
						if (phrase.hasOwnProperty("else"))
						{
							var clause=phrase.else
						}
						else
						{
							var clause=""
						}
					}
				}
				else {var clause=phrase.value}

				var clauseType=typeof clause
				if (clauseType=== "string")  //value is string
				{
					var data =Object.assign({},phrase)
					data.value=clause
				}
				else
				{
					if (clauseType==="function")  
					{
						if(!clause._isIshmlPhrase)  //clause might be normal function or function that returns ishml_phrase function
						{
							clause=clause(ishml_phrase)  //evaluate to string, number, or ishml Phrase
							if(typeof clause !=="function") //if not ishml phrase, treat as simple value
							{
								var data =Object.assign({},phrase)
								data.value=clause
							}
							//else ishml phrase so proceed with next if statement 
						}
						if (clause._isIshmlPhrase) //clause is an ishml_phrase
						{
							var data={}
							var subPhrases=clause()
							data.value= subPhrases.reduce((result,subPhrase)=>
							{
								Object.assign(data,subPhrase)
								return result+subPhrase.value
							},"")	
						}

					}
				}
				if(ishml_phrase._concordance.index.hasOwnProperty(index))
				{
					var placeholder=ishml_phrase[ishml_phrase._concordance.index[index]]
					Object.keys(placeholder).forEach(key=>delete placeholder[key])
					Object.assign(placeholder,data)
				}
				var evaluatedPhrase=Object.assign({},data)
				var silent=phrase.silent
				if (silent)
				{
					if (silent !== true)
					{
						var last=evaluation.length-1
						if(last >=0)
						{
						
							if (typeof silent==="string")
							{
								evaluation[last].value=evaluation[last].value.replace(new RegExp(silent+ "+$"), "")
							}
							else
							{
								evaluation[last].value=evaluation[last].value.replace(silent, "")
							}
						}
					}
					evaluatedPhrase.value=""	
				}
				evaluation.push(evaluatedPhrase)
			})
			return evaluation
		}
		
	}
	ishml.Phrase.attach(ishml_phrase,concordance)
	return ishml_phrase
}
ishml.Phrase.attach=function(ishml_phrase,target)
{

	var say=function(...data) //generates text output
	{
		if (data.length>0){this(...data)}
		this.text=this().reduce((result,item)=>result+item.value,"")
		return this
	}
	var htmlTemplate=function()
	{
		var template = document.createElement("template")
		template.innerHTML = this.text
		return template
	}
	var prepend=function(documentSelector="#story")
	{
		var targetNodes = document.querySelectorAll(documentSelector)
		targetNodes.forEach(node=>node.prepend(this.htmlTemplate().content))
	}
	var append=function(documentSelector="#story")
	{
		var targetNodes = document.querySelectorAll(documentSelector)
		targetNodes.forEach(node=>node.append(this.htmlTemplate().content))
		return this
	}	
	var replace=function(documentSelector="#story")
	{
		var targetNodes = document.querySelectorAll(documentSelector)
		targetNodes.forEach(node=>
		{
			while(node.firstChild){node.removeChild(node.firstChild)}
			node.append(this.htmlTemplate().content)
		})
		return this
	}	
	Object.keys(ishml.Phrase.suffix).forEach(key=>
	{
		Object.defineProperty(ishml_phrase,key,{get:ishml.Phrase.suffix[key]})

	})
	Object.keys(ishml.Phrase.transform).forEach(key=>
	{
		Object.defineProperty(ishml_phrase,key,{value:ishml.Phrase.transform[key],writable:true})

	})
	
	

	/*Object.keys(ishml.Phrase.prefixHandler.prefixes).forEach(key=>
	{
		Object.defineProperty(ishml_phrase,key,{value:ishml.Phrase.prefixHandler.prefixes[key],writable:true})

	})*/

	if (target._isIshmlPhrase)
	{
		Object.assign(ishml_phrase,target)
		Object.defineProperty(ishml_phrase,"_concordance",{value:target._concordance,writable:true})
		
	}
	else
	{
		Object.keys(target.key).forEach(key=>
		{
			ishml_phrase[key]={}
		})
		Object.defineProperty(ishml_phrase,"_concordance",{value:target,writable:true})
	}
	Object.defineProperty(ishml_phrase,"terminal",{value:Object.keys(ishml_phrase._concordance.index).length===0,writable:true})
	Object.defineProperty(ishml_phrase,"_isIshmlPhrase",{value:true,writable:true})
	Object.defineProperty(ishml_phrase,"say",{value:say,writable:true})
	Object.defineProperty(ishml_phrase,"prepend",{value:prepend,writable:true})
	Object.defineProperty(ishml_phrase,"append",{value:append,writable:true})
	Object.defineProperty(ishml_phrase,"replace",{value:replace,writable:true})
	Object.defineProperty(ishml_phrase,"text",{value:"",writable:true})
	Object.defineProperty(ishml_phrase,"htmlTemplate",{value:htmlTemplate,writable:true})

}
//A transform function when called that returns a function that returns the actual transformation.  The transformation returns either text or an object countaining the phrases array and list of placeholders.  

ishml.Phrase.curve={}//some handy curve functions.
ishml.Phrase.curve.serial=function(index,length)
{
	var revised=index+1
	if (revised>length){return {revised:0,reset:true}}
	else {return {revised:revised,reset:true}}
}
ishml.Phrase.curve.uniform=function(index,length)
{
	var revised=Math.floor(Math.random()*length)
	if (revised>length){return {revised:0,reset:true}}
	else {return {revised:revised,reset:true}}
}
ishml.Phrase.curve.decreasing=function(index,length)
{
	var interval=length*(length+1)/2
	var random=Math.floor(Math.random()*denominator)
	var min=0
	var max=0
	for (let i = 0; i < length; i++)
	{

		accummulator+=(length-i)/denominator
		if (random< >accummulator){break}
	}
	return {revised:i}
}	

ishml.Phrase.prefix=function(modifier,returnsString=true)
{
	var named= id=>
	{
		if (returnsString)
		{
			//Convert to ishml phrase generator instead.
			var prefixer=(data)=>
			{
				if (typeof data=== "function")
				{
					var target=data()
					if (target._isIshmlPhrase)
					{
						target=[target.say().text]
					}
					
				}
				if(!target instanceof Array)
				{
					target=[target]
				}
				
				var ishml_phrase=function(...data)
				{	
					if (data.length>0)
					{
						target(...data)
						return ishml_phrase
					}
					else
					{
						var phrases=target()
						phrases.forEach(phrase=>
						{
							phrase.value=modifier(phrase.value)
						})
						return phrases.slice(0)
					}
				}	
				ishml.Phrase.attach(ishml_phrase,target)
				return ishml_phrase(data)
			}
		}
		else
		{
			
				var prefixer=(data)=>modifier(data)

		}
	
		ishml.Phrase[id]=new Proxy(prefixer,ishml.Phrase.prefixHandler)
		
		return this
	}	

	return {named:named}	
}
ishml.Phrase.prefixHandler=
{
	get:function(prefix, property, receiver) //a.b.c() becomes a(b(c()))
	{
		if(property==="isPrefix"){return true}
	
		if (property==="nextPrefix"){return prefix} //bare property without proxy
		
		var nextPrefix= ishml.Phrase[property].nextPrefix//Reflect.get(target,property,receiver)
		var prefixer=(data)=>
		{	
			
			return prefix(nextPrefix(data))//a.b(data) becomes a(b(data))
			
		}
		return new Proxy(prefixer,this)
		
	}
}
ishml.Phrase.suffix={}
ishml.Phrase.transform={}

ishml.Phrase.transform.join=function(options={})
{
	var {separator="",trim=true}=options
	var target=this
	var ishml_phrase=function(...data)
	{	
		if (data.length>0)
		{
			target(...data)
			return ishml_phrase
		}
		else
		{
			var phrases=target()
			var last=phrases.length-1
			var data={}
			data.value=phrases.reduce((result,phrase,index,)=>
			{
				if (phrase.value._isIshmlPhrase)
				{
					var value=phrase.value()
					if (typeof value==="object"){var phrasing=value.value}
					else {var phrasing=value}
				}
				else 
				{
					if (typeof phrase.value ==="object")
					{
						var phrasing=phrase.value.value
						data=object.assign(data,phrase.value)
					}
					else {var phrasing=phrase.value}
				}
				return result+phrasing+((index===last && trim)?"":separator)
			},"")	

			return [data]
		}	
	}
	ishml.Phrase.attach(ishml_phrase,target)
	return ishml_phrase
}
ishml.Phrase.transform.pick=function()
{
	var counter=0
	var target=this
	var ishml_phrase=function(...data)
	{	
		if (data.length>0)
		{
			target(...data)
			counter=0
			return ishml_phrase
		}
		else
		{
			var phrases=target()
			if(phrases.length===0)
			{
				var phrase={value:"",index:0, total:0, reset:true}
				return [phrase]
			}
			else
			{
				var phrase=phrases[counter] 
				phrase.index=counter
				phrase.total=phrases.length

			}

			counter++
			if (counter===phrases.length)
			{
				counter=0
				phrase.reset=true
			}
			else
			{
				phrase.reset=false
			}
			
			return [phrase]
		}	
	}
	ishml.Phrase.attach(ishml_phrase,target)
	return ishml_phrase
}
ishml.Phrase.transform.until=function(condition)
{
	//var a =ishml.Phrase`<li>${{item:ishml.Phrase(["cat","dog", "bird"]).pick()}}</li>`.until((list)=>list.item.reset)
	var target=this
	var untilCondition=condition
	var ishml_phrase=function(...data)
	{
		if (data.length>0)
		{
			target(...data)
			return ishml_phrase
		}
		else
		{
			var revisedPhrases=[]
			do 
			{
				var phrases=target()
				revisedPhrases=revisedPhrases.concat(phrases)
			}
			while (!untilCondition(target))
			return revisedPhrases
		}
	}	
	ishml.Phrase.attach(ishml_phrase,target)
	return ishml_phrase
}	
ishml.Phrase.transform.while=function(condition)
{
	//var a =ishml.Phrase`<li>${{item:ishml.Phrase(["cat","dog", "bird"]).pick()}}</li>`.while((list)=>!list.item.reset)
	var target=this
	var whileCondition=condition
	var ishml_phrase=function(...data)
	{
		if (data.length>0)
		{
			target(...data)
			return ishml_phrase
		}
		else
		{
			var revisedPhrases=[]
			do 
			{
				var phrases=target()
				revisedPhrases=revisedPhrases.concat(phrases)
			}
			while (whileCondition(target))
			return revisedPhrases
		}
	}	
	ishml.Phrase.attach(ishml_phrase,target)
	return ishml_phrase
}


/***************DEFECT: examples of custom transforms.  Remove from final release and add to documentation.  */

ishml.Phrase.transform.identity=function()
{
	var target=this
	var ishml_phrase=function(...data)
	{	
		if (data.length>0)
		{
			target(...data)
			return ishml_phrase
		}
		else
		{
			var phrases=target()
			return phrases.slice(0)
		}
	}

	ishml.Phrase.attach(ishml_phrase,target)
	return ishml_phrase
}
ishml.Phrase.transform.cap=function()
{
	var target=this
	var ishml_phrase=function(...data)
	{	
		if (data.length>0)
		{
			target(...data)
			return ishml_phrase
		}
		else
		{
			var phrases=target()
			phrases=phrases.map(phrase=>
			{
				if (phrase.value.length>0)
				{
					revisedPhrase=Object.assign({},phrase)
					revisedPhrase.value=phrase.value[0].toUpperCase()+phrase.value.slice(1)
					return revisedPhrase
				}	
			})
		}	
		return phrases
	}
	ishml.Phrase.attach(ishml_phrase,target)
	return ishml_phrase
}
ishml.Phrase.phraseModifier=function(modifier)
{

	var prefix= id=>
	{
		var prefixer=(data)=>
		{
			if (typeof data ==="function")
			{
				if (data._isIshmlPhrase)
				{
					var target=data
				}
				else
				{
					var target=data()  //custom function must return ishml_phrase
				}
				
			}	
			else
			{
				var target=ishml.Phrase(data)
			}
			var ishml_phrase=function(...data)
			{	
				if (data.length>0)
				{
					target(...data)
					return ishml_phrase
				}
				else
				{
					var phrases=target()
					return modifier(phrases)()
				}
			}	
			ishml.Phrase.attach(ishml_phrase,target)
			return ishml_phrase
		}

		ishml.Phrase[id]=new Proxy(prefixer,ishml.Phrase.prefixHandler)
		
	}	
	
	var suffix=(id)=>
	{
		var suffixer=function()
		{
			var target=this
			var ishml_phrase=function(...data)
			{	
				if (data.length>0)
				{
					target(...data)
					return ishml_phrase
				}
				else
				{
					var phrases=target()
					return modifier(phrases)()
				}
			}	
			ishml.Phrase.attach(ishml_phrase,target)
			return ishml_phrase
		}
		ishml.Phrase.suffix[id]=suffixer
	}	
	return {prefix:prefix,suffix:suffix}
}	
ishml.Phrase.textModifier=function(modifier)
{  //DEFECT: should do deep copy of phrases.
	var prefix= id=>
	{
		var prefixer=(data)=>
		{
			if (data._isIshmlPhrase)
			{
				var target=data
			}	
			else
			{
				var target=ishml.Phrase(data)
			}
			var ishml_phrase=function(...data)
			{	
				if (data.length>0)
				{
					target(...data)
					return ishml_phrase
				}
				else
				{
					var phrases=target()
					return phrases.map(phrase=>
					{
						phrase.value=modifier(phrase.value)
						return phrase
					})
				}
			}	
			ishml.Phrase.attach(ishml_phrase,target)
			return ishml_phrase
		}
		ishml.Phrase[id]=new Proxy(prefixer,ishml.Phrase.prefixHandler)
		
		
		return this
	}	
	var suffix=(id)=>
	{
		var suffixer=function()
		{
			var target=this
			var ishml_phrase=function(...data)
			{	
				if (data.length>0)
				{
					target(...data)
					return ishml_phrase
				}
				else
				{
					var phrases=target()
					return phrases.map(phrase=>
					{
						phrase.value=modifier(phrase.value)
						return phrase
					})
				}
			}	
			ishml.Phrase.attach(ishml_phrase,target)
			return ishml_phrase
		}

		ishml.Phrase.suffix[id]=suffixer

		return this
	}
	return {prefix:prefix,suffix:suffix}

}
