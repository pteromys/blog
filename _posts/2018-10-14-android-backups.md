---
title: "Android Backups: A Yak Shave"
excerpt_separator: <!--more-->
---

The other day I finally got around to taking a backup of an ancient Nexus 7.
[A Stack Exchange answer by camalot][SEcamalot] lists a few methods
for turning it into plain files, so I go ahead and try the one that doesn't
require me to download anything...
{:itemprop="description"}

```sh
% { printf "\x1f\x8b\x08\x00\x00\x00\x00\x00"; tail -c +25 ../clipper2.adb; } | tar -xvz
...
gzip: stdin: unexpected end of file
tar: Child returned status 1
tar: Error is not recoverable: exiting now
```

Uh-oh.

[SEcamalot]: https://android.stackexchange.com/a/28483

<!--more-->

## The device

### Loose plugs cause bugs

The first few tries, I didn't even get the "Backup finished" toast notification
due to a loose USB cable. Turns out syslog messages like `USB disconnect,
address 58` indicate bad things when they're timestamped suspiciously near the
backup file's mtime. Who knew?

### adb logcat

But having solved that, did I still end up with a truncated file due to
some badness on the device? [Apparently misbehaving apps can cause it][ABE49].
Looking through the output of `adb logcat -s BackupManagerService`, at first
things are pretty reassuring:

```
09-17 23:28:16.568   656  1510 V BackupManagerService: Requesting full backup: apks=false obb=false shared=true all=true system=true pkgs=[Ljava.lang.String;@7c66c2f
...
09-17 23:38:48.689   656  3792 D BackupManagerService: Full backup pass complete.
```

Googling finds [users having problems with shared storage][UnrecognizedDomain].
Hm, that log message wouldn't have been captured by `-s BackupManagerService`,
so I try again with just the shared storage and indeed, there it is:

```sh
% adb backup -shared -f /home/pteromys/clipper5.adb
% adb logcat
...
09-18 00:08:16.363 21132 21143 I FullBackup: Unrecognized domain shared/0
```

That looks beyond my ability to fix. Fortunately I'm not seeing any other
obvious problems in the log, so I just rerun the backup with `-noshared`,
then pull the shared storage separately as plain files:

```sh
% adb backup -all -noshared -f /home/pteromys/clipper6.adb
% adb pull /sdcard /home/pteromys/clipper-backup-sdcard
```

### When your tools think your devices are too old

As I'm closing out the accumulated windows this catches my eye elsewhere in
the logs:

```
09-17 23:42:25.840  8500  8500 D AndroidRuntime: Calling main entry com.android.commands.bu.Backup
09-17 23:42:25.841  8500  8500 D bu      : Beginning: help
09-17 23:42:25.842  8500  8500 E bu      : Invalid operation 'help'
09-17 23:42:25.842  8500  8500 D bu      : Finished.
09-17 23:42:25.842  8500  8500 D AndroidRuntime: Shutting down VM
```

Riiiiight. So this was sort of a lie:

```
% adb help
...
backup/restore:
   to show usage run "adb shell bu help"
...
```

I'm guessing it's because Nexus 7s stopped getting updates long before
[bu got its help message][buhelpcommit] but I keep getting new releases of adb.

Anyway, mission still accomplished, right? Close remaining windows, unplug the
USB cable, go to sleep, and finish this another day.

[ABE49]: https://github.com/nelenkov/android-backup-extractor/issues/49#issuecomment-412366371
[UnrecognizedDomain]: https://talk.sonymobile.com/t5/Xperia-Z5-Z5-Compact-Z5-Premium/Sony-Xperia-Z5-Compact-fails-to-adb-backup-shared-storage/td-p/1136642
[buhelpcommit]: https://android.googlesource.com/platform/frameworks/base/+/9d5f8e11e11e93fbf0d9cbcbb68b7b0062695e5d

## The file

### The zlib file format according to pyflate

Would've been too easy if it had ended there, wouldn't it? I get the same
gzip message on `clipper6.adb` the next day. Maybe the zlib file format will
have some clues? [Calmarius's guide to zlib + deflate][Calmarius] explains that
it's (modulo header and footer) just a concatenated stream of blocks. Awesome,
except...

1. blocks aren't necessarily byte-aligned,
2. their boundaries are marked by an end-of-block symbol instead of listed
   up front so you have to scan the file to find them, and
3. it's Huffman encoded so you can't find the end-of-block
   symbol until you've decoded all the codewords before it.

Still, if you can do it, you can test a hypothesis: maybe gzip expects more
because adb/bu didn't bother to set the "this is the last block" bit on the
last block. Neither gzip nor python's zlib module divulges this kind of
information about their internal state; but [pyflate][pyflate] will, and in
more detail than your most prolific friends on Facebook.

Maybe hack out the parts that write the decompressed data to a file, though;
all we're interested in is what it does to the end. And of course it'll be
slower than gzip, so go find a snack or something. And eventually...

### The pyflate output

```
% python2 ~/.local/lib/python2/site-packages/pyflate.py =(echo -n '\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\x03'; tail -c +27 /home/pteromys/clipper6.adb)
...
new block at (580253004, 0)
last bit 0x0
deflate-blocktype 0 stored beginning at (580253004, 0)
raw block data at (580253004, 3)
new block at (580253009, 0)
last bit 0x1
deflate-blocktype 1 static huff beginning at (580253009, 0)
raw block data at (580253009, 3)
raw data at (580253009, 3) bits 3
found symbol 0xa3 of len 8 mapping to 0x11d
reading 0 extra bits for len
found symbol 0x0 of len 5 mapping to 0x0
reading 0 extra bits for dist
dictionary lookup: length 258 copy -1 num bits 13 data '\x00...\x00'
found symbol 0xa3 of len 8 mapping to 0x11d
reading 0 extra bits for len
found symbol 0x0 of len 5 mapping to 0x0
reading 0 extra bits for dist
dictionary lookup: length 258 copy -1 num bits 13 data '\x00...\x00'
found symbol 0xa3 of len 8 mapping to 0x11d
reading 0 extra bits for len
found symbol 0x0 of len 5 mapping to 0x0
reading 0 extra bits for dist
dictionary lookup: length 258 copy -1 num bits 13 data '\x00...\x00'
found symbol 0x23 of len 8 mapping to 0x11c
reading 5 extra bits for len
found symbol 0x0 of len 5 mapping to 0x0
reading 0 extra bits for dist
dictionary lookup: length 250 copy -1 num bits 18 data '\x00...\x00'
found symbol 0x0 of len 7 mapping to 0x100
eos 0 count 0 bits 7
end of Huffman block encountered
this was the last block, time to leave (580253017, 3)
Traceback (most recent call last):
  File "/home/pteromys/.local/lib/python2/site-packages/pyflate.py", line 678, in <module>
    _main()
  File "/home/pteromys/.local/lib/python2/site-packages/pyflate.py", line 648, in _main
    out = gzip_main(field)
  File "/home/pteromys/.local/lib/python2/site-packages/pyflate.py", line 629, in gzip_main
    final_length = b.readbits(32)
  File "/home/pteromys/.local/lib/python2/site-packages/pyflate.py", line 71, in readbits
    self.needbits(n)
  File "/home/pteromys/.local/lib/python2/site-packages/pyflate.py", line 37, in needbits
    self._more()
  File "/home/pteromys/.local/lib/python2/site-packages/pyflate.py", line 62, in _more
    c = self._read(1)
  File "/home/pteromys/.local/lib/python2/site-packages/pyflate.py", line 32, in _read
    raise "Length Error"
TypeError: exceptions must be old-style classes or derived from BaseException, not str
```

### The breakdown

Here's what we see in those last two blocks:

1. An empty uncompressed block, which ends with its length marker `0000ffff`.
2. The next block starts with a 1 bit, so it was marked as the last block
   after all. So much for that hypothesis.
   * Its contents are 258 + 258 + 258 + 250 = 1024 zeros, which
     reassuringly is [how a tarball is supposed to end][WPtar].
3. The end-of-block symbol gets read... then what is it trying to read after
   that?

The (zero-indexed) byte in which the empty block starts is 580253004 + 26
(bytes we chopped off with `tail`) - 10 (bytes in the fake header we added) + 2
(bytes that `pyflate.py` skips before starting its count), which comes out
to 580253022. The file contents at this byte and forward are (recall `tail`
is 1-indexed):

```sh
% tail -c +580253023 clipper6.adb | xxd
00000000: 0000 00ff ff1b 05a3 6014 8c5c 0000 df82  ........`..\....
00000010: f504                                     ..
```

Decompressing that final block by hand is an educational experience, but
let's skip that and pretend I trusted pyflate all along like I should have.

The last message before the exception tells us that the end-of-block symbol
ends in the fifth-to-last byte, which leaves 4 bytes behind.
The [gzip footer][ForensicsWiki] is supposed to be 4 bytes of checksum
and 4 bytes of uncompressed data size; maybe the size is all we're missing?
That would be very consistent with the `final_length = b.readbits(32)` in
the traceback above...

```sh
% { printf "\x1f\x8b\x08\x00\x00\x00\x00\x00"; tail -c +25 ../clipper2.adb; } | zcat | wc -c
gzip: stdin: unexpected end of file
3734081536

% python -c 'print("%x" % 3734081536)'
de919000

% { printf "\x1f\x8b\x08\x00\x00\x00\x00\x00"; tail -c +25 ../clipper6.adb; printf "\x00\x90\x91\xde"; } | zcat > /dev/null
gzip: stdin: invalid compressed data--crc error
```

Ok, I can live with that for now. Let's just try one more time with a fake
size, to check that we really got the size right...

```sh
% { printf "\x1f\x8b\x08\x00\x00\x00\x00\x00"; tail -c +25 ../clipper6.adb; printf "\x00\x90\x91\xdf"; } | zcat > /dev/null
gzip: stdin: invalid compressed data--crc error
gzip: stdin: invalid compressed data--length error
```

Yay.

[Calmarius]: http://calmarius.net/?lang=en&page=programming%2Fzlib_deflate_quick_reference
[pyflate]: https://github.com/pfalcon/pyflate
[WPtar]: https://en.wikipedia.org/wiki/Tar_(computing)#File_format
[ForensicsWiki]: https://www.forensicswiki.org/wiki/Gzip#File_footer

