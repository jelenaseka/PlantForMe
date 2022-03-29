package errors

import "fmt"

type AlreadyExistsException struct {
	Message string
}

type NotExistsException struct {
	Message string
}

func (e *AlreadyExistsException) Error() string {
	return fmt.Sprintf(e.Message)
}

func ThrowAlreadyExistsException(m string) error {
	return &AlreadyExistsException{Message: m}
}

func (e *NotExistsException) Error() string {
	return fmt.Sprintf(e.Message)
}

func ThrowNotExistsException(m string) error {
	return &NotExistsException{Message: m}
}
