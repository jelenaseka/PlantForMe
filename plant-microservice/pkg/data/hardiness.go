package data

type Hardiness int

const (
	Tender Hardiness = iota
	HalfHardy
	Hardy
)

func (h Hardiness) String() string {
	switch h {
	case Tender:
		return "tender"
	case HalfHardy:
		return "half hardy"
	case Hardy:
		return "hardy"
	}
	return "unknown"
}
