package data

type Month int

const (
	January Month = iota
	February
	March
	April
	May
	June
	July
	August
	September
	October
	November
	December
)

type BloomingMonth struct {
	ID    int   `json:"id"`
	Month Month `gorm:"unique" json:"month"`
}

func (m Month) String() string {
	switch m {
	case January:
		return "january"
	case February:
		return "february"
	case March:
		return "march"
	case April:
		return "april"
	case May:
		return "may"
	case June:
		return "june"
	case July:
		return "july"
	case August:
		return "august"
	case September:
		return "september"
	case October:
		return "october"
	case November:
		return "november"
	case December:
		return "december"
	}
	return "unknown"
}
