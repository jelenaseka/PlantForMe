package data

type Light int

const (
	Direct Light = iota
	Indirect
	PartialShade
	Shade
)

func (l Light) String() string {
	switch l {
	case Direct:
		return "direct"
	case Indirect:
		return "indirect"
	case PartialShade:
		return "partial shade"
	case Shade:
		return "shade"
	}
	return "unknown"
}
