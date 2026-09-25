import dis
import marshal
import struct
from pathlib import Path

pyc = Path(r'E:\Desktop\Hackathon\Technova\KNEURA\backend\__pycache__\app.cpython-314.pyc')
out = Path(r'E:\Desktop\Hackathon\Technova\KNEURA\.kneura\recovery')
out.mkdir(parents=True, exist_ok=True)
data = pyc.read_bytes()
code = marshal.loads(data[16:])

def children(c):
    return [x for x in c.co_consts if isinstance(x, type(c))]

def walk(c, depth=0):
    print('  '*depth + f'{c.co_name} line={c.co_firstlineno} args={c.co_argcount} locals={c.co_nlocals}')
    for child in children(c):
        walk(child, depth+1)

with (out / 'metadata.txt').open('w', encoding='utf-8') as stream:
    stream.write(f'pyc={pyc}\nbytes={len(data)}\nmagic={data[:4].hex()}\nflags={struct.unpack("<I", data[4:8])[0]}\nsource={code.co_filename}\n')
    stream.write('module_names=\n' + '\n'.join(code.co_names) + '\n\ncode_objects=\n')
    import contextlib
    with contextlib.redirect_stdout(stream):
        walk(code)
with (out / 'disassembly.txt').open('w', encoding='utf-8') as stream:
    dis.dis(code, file=stream, depth=10)
print(out)
