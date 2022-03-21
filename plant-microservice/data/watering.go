package data

type Watering int

const (
	Daily Watering = iota
	TwiceAWeek
	OnceAWeek
	TwiceAMonth
	OnceAMonth
)

func (w Watering) String() string {
	switch w {
	case Daily:
		return "daily"
	case TwiceAWeek:
		return "twice a week"
	case OnceAWeek:
		return "once a week"
	case TwiceAMonth:
		return "twice a month"
	case OnceAMonth:
		return "once a month"
	}
	return "unknown"
}
