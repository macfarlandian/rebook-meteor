#Rebook CFI

inspired by Epub CFI, but with 100% less Epub.

##Fragment identification rules


###Use persistent IDs whenever possible

Structural elements (Books, Containers, Chapters) have UIDs assigned by the database. Reader templates **must** expose these in their corresponding HTML elements as ID attributes.

This allows for a shorter CFI path because we can directly point to the lowest relevant level of granularity and let the app worry about the arbitrary hierarchy depth.

E.g., the friendliest way to identify a passage in a paragraph is with the Resource ID (attached to each paragraph), because a resource belongs to only one Chapter, which belongs to only one Container, etc., so rebook can resolve everything else up the hierarchy. 

TODO: 
- UID syntax may not be compatible with HTML id spec ... 
	- use microdata? 
	- apply a transformation or something? 
- prefixes for structural types?

###Paragraph fragment IDs

Tag all block elements with the Resource UID
specify the ID, tag, and index (0-indexed)

Syntax: tag,id,index
	(comma delimited)

####Inline fragments
character slice syntax
- [0:100] etc
	+ P,helwhenSDLeje28,8[45:98]

####Multi-paragraph fragments
- P,helwhenSDLeje28,8[45]|P,helwhenSDLeje28,9[:15]

###Structural IDs

Syntax: structure_key,id
e.g., 
- CHAP,helwhenSDLeje28
- SEQ,helwhenSDLeje28
- COLL,helwhenSDLeje28

