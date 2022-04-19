package dto

import "forum-microservice/pkg/data"

type CommentResponse struct {
	ID       string `json:"id"`
	Content  string `json:"content"`
	Username string `json:"username"`
	PostID   string `json:"postID"`
}

func NewCommentResponse(comment data.Comment) *CommentResponse {
	return &CommentResponse{
		ID:       comment.ID.String(),
		Content:  comment.Content,
		Username: comment.Username,
		PostID:   comment.PostID.String(),
	}
}
