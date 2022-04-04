package data

type Height int

const (
	Tiny Height = iota
	Small
	Medium
	Tall
)

func (h Height) String() string {
	switch h {
	case Tiny:
		return "tiny"
	case Small:
		return "small"
	case Medium:
		return "medium"
	case Tall:
		return "tall"
	}
	return "unknown"
}
