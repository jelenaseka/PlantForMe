package data

type TaskStatus int

const (
	WAITING TaskStatus = iota
	DONE
	PASSED
)

func (t TaskStatus) String() string {
	switch t {
	case WAITING:
		return "Waiting"
	case DONE:
		return "Done"
	case PASSED:
		return "Passed"
	}
	return "Unknown"
}
