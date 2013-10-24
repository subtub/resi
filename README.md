# RecursiveContentInclude v0.3.1  

[![Build Status](https://travis-ci.org/WrongEntertainment/RecursiveContentInclude.png?branch=master)](https://travis-ci.org/WrongEntertainment/RecursiveContentInclude)

## Table of Content

[General Information](#general-information)  
[API](#api)  

## General Information

Include files into files, recursive, yap!  

_[back to table of content](#table-of-content)_
## API
 
readFileSync(path, \[options\])
-------------------------------
Read a file and run the include process.



**Parameters**

**path**:  *String*,  The filepath.

**[options]**:  *Object*,  beginTag String, default: `<%>`, endTag String, default: `</%>`

**Returns**

*String*,  The processed content.

lexer(content, beginTag, endTag)
--------------------------------
Parse the file and return an array.



**Parameters**

**content**:  *String*,  The content we want to parse.

**beginTag**:  *String*,  The begin tag.

**endTag**:  *String*,  The end tag.

**Returns**

*Array*,  The lexed array.

process(content, beginTag, endTag)
----------------------------------
Process the content string and return the result.



**Parameters**

**content**:  *String*,  The content we want to parse.

**beginTag**:  *String*,  The begin tag.

**endTag**:  *String*,  The end tag

**Returns**

*String*,  The processed content.

isHttp(str)
-----------
Check if the tag is a http or https url.



**Parameters**

**str**:  *String*,  The tag content.

**Returns**

*Boolean*,  true or false.

isScript(str)
-------------
Check if the tag is a script.
The script tag begin with "script: ".



**Parameters**

**str**:  *String*,  The script content.

**Returns**

*Boolean*,  true or false.


_[back to table of content](#table-of-content)_
## Contributors

```
 project  : RecursiveContentInclude
 repo age : 5 days
 active   : 6 days
 commits  : 70
 files    : 20
 authors  : 
    70	Paul Vollmer            100,0%

```


_[back to table of content](#table-of-content)_
## License

```
The MIT License (MIT)  
  
Copyright (c) 2013 subtub  
  
Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:  
  
The above copyright notice and this permission notice shall be included in  
all copies or substantial portions of the Software.  
  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN  
THE SOFTWARE.  
  ```

_[back to table of content](#table-of-content)_


---

*This Readme was generated by [subtool](https://www.github.com/subtub/subtool/releases/tag/v0.3.1) on Thu Oct 24 2013 15:07:30 GMT+0200 (CEST).*  
