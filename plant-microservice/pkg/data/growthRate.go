package data

type GrowthRate int

const (
	FastGrowing GrowthRate = iota
	MediumGrowing
	SlowGrowing
)

func (gr GrowthRate) String() string {
	switch gr {
	case FastGrowing:
		return "fast growing"
	case MediumGrowing:
		return "medium growing"
	case SlowGrowing:
		return "slow growing"
	}
	return "unknown"
}
