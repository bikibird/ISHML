ISHML.Parser=function Parser({lexicon,grammar}={})
{
	if (this instanceof ISHML.Parser)
	{
		this.lexicon=lexicon
		this.grammar=grammar
	}
	else
	{
		return new Parser({lexicon:lexicon,grammar:grammar})
	}
}
ISHML.Parser.prototype.analyze=function(text, {caseSensitive=false, full=false, fuzzy=false, greedy=false, lax=false, smooth=false,separator=/\s/}={})
{    
	var tokenizations = this.lexicon.tokenize(text,{caseSensitive:caseSensitive, full:full, fuzzy:fuzzy, greedy:greedy, lax:lax, smooth:smooth, separator:separator})
	var interpretations=[]
	var partialInterpretations=[]
	var completeInterpretations=[]
	if (tokenizations.complete.length > 0)
	{
		tokenizations.complete.forEach((sequence)=>
		{
			var result=this.grammar.parse(sequence)
			if (result)
			{
				interpretations=interpretations.concat(result)
			}
		})

		interpretations.forEach((interpretation)=>
		{
			if (interpretation.remainder.tokens.length>0)
			{
				partialInterpretations.push(interpretation)
			}
			else
			{
				completeInterpretations.push(interpretation)
			}
		})
		if (completeInterpretations.length>0)
		{	
			return {success:true, interpretations:completeInterpretations}
		}
		else
		{
			return {success:false, interpretations: partialInterpretations.sort(function(first,second){return first.remainder.tokens.length - second.remainder.tokens.length})}
			
		}
	}
	else
	{

		return {success:false, tokenizations:tokenizations.partial}
		
	}	
}