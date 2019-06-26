ISHML.Tokenization=function Tokenization(tokens=[],remainder="")
{
   if (this instanceof ISHML.Tokenization)
	{
		this.tokens=tokens.slice(0)
		this.remainder=remainder.slice(0)
		return this
	}
	else
	{
		return new Tokenization(tokens,remainder)
	}
}
ISHML.Tokenization.prototype.clone=function() 
{
	return new ISHML.Tokenization(this.tokens,this.remainder)
}