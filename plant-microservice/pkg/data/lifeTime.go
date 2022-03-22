package data

type LifeTime int

const (
	Annuals LifeTime = iota
	Beinnials
	Perennials
)

func (l LifeTime) String() string {
	switch l {
	case Annuals:
		return "annuals"
	case Beinnials:
		return "beinnials"
	case Perennials:
		return "perennials"
	}
	return "unknown"
}
