set +x
curr_day=$(TZ="America/New_York" date '+%-d')
day="${1:-$curr_day}"
echo "fetching $day..."
curl https://adventofcode.com/2022/day/$day/input -H 'cookie:session=53616c7465645f5fe2e16f28c04c0ee49d9a94484adef26d0fe65ce7323d052f3a508fa570dc4c828f8aa25165ffa339469a449502b1712062ef9d35663bbe54' > inputs/$day.txt
