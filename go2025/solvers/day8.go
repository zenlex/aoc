package solvers

import (
	"container/heap"
	"sort"
	"strconv"
	"strings"
)

var QueueDepth = 1000

type Point3D struct {
	X, Y, Z int
}

type pair struct {
	P        Point3D
	Q        Point3D
	Distance int
}

type NodeHeap []pair

func (h NodeHeap) Len() int           { return len(h) }
func (h NodeHeap) Less(i, j int) bool { return h[i].Distance < h[j].Distance }
func (h NodeHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *NodeHeap) Push(x any) {
	*h = append(*h, x.(pair))
}

func (h *NodeHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

type DSU struct {
	parent map[Point3D]Point3D
	size   map[Point3D]int
	count  int
}

func NewDSU(boxes []Point3D) *DSU {
	parent := make(map[Point3D]Point3D)
	size := make(map[Point3D]int)

	for _, box := range boxes {
		parent[box] = box
		size[box] = 1
	}
	return &DSU{
		parent: parent,
		size:   size,
		count:  len(boxes),
	}
}

func (d *DSU) Find(p Point3D) Point3D {
	if d.parent[p] != p {
		d.parent[p] = d.Find(d.parent[p])
	}
	return d.parent[p]
}

func (d *DSU) Union(a, b Point3D) bool {
	rootA := d.Find(a)
	rootB := d.Find(b)

	if rootA == rootB {
		return false
	}

	if d.size[rootA] < d.size[rootB] {
		rootA, rootB = rootB, rootA
	}
	d.parent[rootB] = rootA
	d.size[rootA] += d.size[rootB]
	d.count--
	return true
}

func (d *DSU) Count() int { return d.count }

func (p Point3D) DistanceSq(q Point3D) int {
	dx, dy, dz := p.X-q.X, p.Y-q.Y, p.Z-q.Z
	return dx*dx + dy*dy + dz*dz
}

func stringToPoint(s string) Point3D {
	vals := strings.Split(strings.TrimSpace(s), ",")
	if len(vals) != 3 {
		panic("bad line " + s)
	}
	x, _ := strconv.Atoi(vals[0])
	y, _ := strconv.Atoi(vals[1])
	z, _ := strconv.Atoi(vals[2])
	return Point3D{x, y, z}
}

func SolveD8(input string) (int, int) {
	boxes := parseCoords(input)
	distances := distanceMap(boxes)
	q1 := nearestNeighbors(distances)
	q2 := make(NodeHeap, len(q1))
	copy(q2, q1)
	heap.Init(&q2)

	dsu1 := NewDSU(boxes)
	depth := QueueDepth
	if depth == -1 {
		depth = len(q1)
	}

	for i := 0; i < depth && q1.Len() > 0; i++ {
		e := heap.Pop(&q1).(pair)
		dsu1.Union(e.Q, e.P)
	}

	rootSize := make(map[Point3D]int)
	for _, b := range boxes {
		root := dsu1.Find(b)
		rootSize[root]++
	}

	var sizes []int
	for _, size := range rootSize {
		sizes = append(sizes, size)
	}
	sort.Slice(sizes, func(i, j int) bool { return sizes[i] > sizes[j] })

	p1 := 1
	for i := 0; i < 3 && i < len(sizes); i++ {
		p1 *= sizes[i]
	}

	dsu2 := NewDSU(boxes)
	p2 := 0
	for q2.Len() > 0 {
		e := heap.Pop(&q2).(pair)
		if dsu2.Union(e.Q, e.P) {
			if dsu2.Count() == 1 {
				p2 = e.Q.X * e.P.X
				break
			}
		}
	}
	return p1, p2
}

func parseCoords(input string) []Point3D {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	coords := make([]Point3D, len(lines))
	for i, line := range lines {
		point := stringToPoint(line)
		coords[i] = point
	}

	return coords
}

func distanceMap(boxes []Point3D) map[Point3D]map[Point3D]int {
	distances := make(map[Point3D]map[Point3D]int)
	for _, box := range boxes {
		distances[box] = make(map[Point3D]int)
	}
	for i, box := range boxes {
		for j := i + 1; j < len(boxes); j++ {
			neighbor := boxes[j]
			dist := box.DistanceSq(neighbor)
			distances[box][neighbor] = dist
		}
	}

	return distances
}

func nearestNeighbors(distanceMap map[Point3D]map[Point3D]int) NodeHeap {
	queue := NodeHeap{}
	for start, neighbors := range distanceMap {
		for neighbor, distance := range neighbors {
			pair := pair{
				P:        start,
				Q:        neighbor,
				Distance: distance,
			}
			queue = append(queue, pair)
		}
	}
	heap.Init(&queue)
	return queue
}

func init() {
	Register(8, SolveD8)
}
