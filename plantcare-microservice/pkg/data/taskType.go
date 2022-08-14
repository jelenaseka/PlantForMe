package data

type TaskType int

const (
	WATERING TaskType = iota
	TRANSPLANT
	TRIME
	FERTILIZE
	FUNGICIDE
	INSECTICIDE
)

func (t TaskType) String() string {
	switch t {
	case WATERING:
		return "Watering"
	case TRANSPLANT:
		return "Transplant"
	case TRIME:
		return "Trime"
	case FERTILIZE:
		return "Fertilize"
	case FUNGICIDE:
		return "Fungicide"
	case INSECTICIDE:
		return "Insecticide"
	}
	return "Unknown"
}
