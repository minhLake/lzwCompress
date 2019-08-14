# lzwCompress
>在JavaScript中为字符串对象实现无损LZW压缩/解压缩，支持中文。（Lossless LZW compression/decompression implemented in JavaScript for strings objects., support for Chinese.）

### Usage:

```
var strings = '在JavaScript中为字符串对象实现无损LZW压缩/解压缩，支持中文';
var compress = null;
var decompress = null;

//compress
compress = lzwCompress.pack(strings)

//decompress
decompress = lzwCompress.unpack(compress)

//log: compress = 'å¨JavaScriptä¸­čºå­ç¬¦č²å¯¹è±¡å®ç°æ æLZWåç¼©/è§£įıĳï¼æ¯æč­æ'
//log: decompress = '在JavaScript中为字符串对象实现无损LZW压缩/解压缩，支持中文'
```

### License

[MIT License](LICENSE)