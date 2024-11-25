import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
const Profile = () => {
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { currentUser } = useContext(AuthContext);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { isLoading: loadingUser, data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/${userId}`);
      return res.data;
    },
  });

  const { isLoading: loadingFollower, data: followers } = useQuery({
    queryKey: ["relationship"],
    queryFn: async () => {
      const res = await makeRequest.get(
        `/relationships?followedUserId=${userId}`
      );
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (followed) => {
      if (followed)
        return makeRequest.delete(`/relationships?userId=${userId}`);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = async () => {
    mutation.mutate(followers.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {loadingUser ? (
        "Loading"
      ) : (
        <>
          <div className="images">
            <img src={'/uploads/' + user.coverPic} alt="" className="cover" />
            <img src={'/uploads/' + user.profilePic} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{user.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{user.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{user.website}</span>
                  </div>
                </div>
                {loadingFollower ? (
                  "Loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {followers?.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
    </div>
  );
};

export default Profile;
