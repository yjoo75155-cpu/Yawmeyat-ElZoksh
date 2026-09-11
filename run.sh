#!/data/data/com.termux/files/usr/bin/bash
cd "$(dirname "$0")"
echo "يوميات الزوكش V6"
echo "افتح: http://127.0.0.1:8080"
python -m http.server 8080 --bind 127.0.0.1
