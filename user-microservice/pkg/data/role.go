package data

type Role int

const (
	Public Role = iota //TODO delete
	Member
	Moderator
	Admin
)

func (r Role) String() string {
	switch r {
	case Public:
		return "Public"
	case Member:
		return "Member"
	case Moderator:
		return "Moderator"
	case Admin:
		return "Admin"
	}
	return "unknown"
}
