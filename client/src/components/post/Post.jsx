import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import moment from "moment";
import Comments from "../comments/Comments";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const { data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/comments?postId=${post.id}`);
      return res.data;
    },
  });

  const { data: likes } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/likes?postId=${post.id}`);
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete(`/likes?postId=${post.id}`);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", post.id]);
    },
  });

  const handleLike = () => {
    mutation.mutate(likes?.includes(currentUser.id));
  };

  const isLiked = likes?.includes(currentUser.id);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={'/uploads/' + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={`/uploads/${post.img}`} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLiked ? (
              <FavoriteOutlinedIcon onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {likes && likes.length > 0 ? `${likes.length} Likes` : "0 Likes"}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {comments && comments.length > 0
              ? `${comments.length} Comments`
              : "0 Comments"}
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
