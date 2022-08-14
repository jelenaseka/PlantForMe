package data

type Role int

const (
	Member Role = iota
	Moderator
	Admin
)

func (r Role) String() string {
	switch r {
	case Member:
		return "Member"
	case Moderator:
		return "Moderator"
	case Admin:
		return "Admin"
	}
	return "unknown"
}
