#Rebook CFI

inspired by Epub CFI, but with 100% less Epub.

##Fragment identification rules


###Use persistent IDs whenever possible

Structural elements (Books, Containers, Chapters) have UIDs assigned by the database. Reader templates **must** expose these in their corresponding HTML elements as ID attributes.

This allows for a shorter CFI path because we can directly point to the lowest relevant level of granularity and let the app worry about the arbitrary hierarchy depth.

TODO: 
- UID syntax may not be compatible with HTML id spec ... 
	- use microdata? 
	- apply a transformation or something? 
- prefixes for structural types?

###Text fragment IDs

Tag all block elements with the Resource UID
specify the ID, tag, and index (0-indexed)

Syntax: tag,id,index
	(comma delimited)