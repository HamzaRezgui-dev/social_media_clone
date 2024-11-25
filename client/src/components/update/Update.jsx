import React, { useState } from "react";
import "./Update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [texts, setTexts] = useState({
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userInfo) => {
      return makeRequest.put("/users", userInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };
  return (
    <>
      <div className="backdrop" onClick={() => setOpenUpdate(false)}></div>

      <div className="update">
        <div className="header-update">
          <h2>Update</h2>
          <button className="x-button" onClick={() => setOpenUpdate(false)}>X</button>
        </div>
        <form>
          <input
            type="file"
            name="profilePic"
            onChange={(e) => setProfile(e.target.files[0])}
          />
          <input
            type="file"
            name="coverPic"
            onChange={(e) => setCover(e.target.files[0])}
          />
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={texts.name}
          />
          <input
            type="text"
            name="city"
            onChange={handleChange}
            value={texts.city}
          />
          <input
            type="text"
            name="website"
            onChange={handleChange}
            value={texts.website}
          />
          <button className="update-profile-button" style={{ marginTop: "20px" }} onClick={handleClick}>
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default Update;
