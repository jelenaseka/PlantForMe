package data

type Role int

const (
	Public Role = iota
	RegisteredUser
	Moderator
	Admin
)

func (r Role) String() string {
	switch r {
	case Public:
		return "Public"
	case RegisteredUser:
		return "Registered user"
	case Moderator:
		return "Moderator"
	case Admin:
		return "Admin"
	}
	return "unknown"
}
