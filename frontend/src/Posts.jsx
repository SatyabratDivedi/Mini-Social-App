import {useState, useEffect, useCallback} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaHeart} from "react-icons/fa";
import {toast} from "react-hot-toast";
import {MdDeleteForever} from "react-icons/md";

const Posts = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState();
  const [userName, setUserName] = useState();
  const [posts, setPosts] = useState();
  const [userId, setUserId] = useState();

  const editHandle = (e) => {
    setEdit(e.target.value);
  };
  const postHandle = (e) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      body: JSON.stringify({edit}),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);
    setUserId(data.user._id);
    if (data.msg == "unauthorized! please login first") {
      navigate("/signin");
      toast.error(data.msg);
    }
    if (res.ok) {
      setEdit("");
      toast.success(data.msg);
      fetchAllPosts()
    }
    setUserName(data.user.name);
  };

  const fetchAllPosts = async () => {
    const res = await fetch("http://localhost:3000/api/all-posts");
    const data = await res.json();
    console.log(data); 
    setPosts(data);
  };

  const fetchLikePost = useCallback(
    async (postId) => {
      const res = await fetch(`http://localhost:3000/api/like-post/${postId}`, {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log(res);
      if(res.ok){
        fetchAllPosts();
      }
    },
    []
  );

  const deletePost = useCallback(
    async (postId) => {
      const res = await fetch(`http://localhost:3000/api/delete-post/${postId}`, {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        console.log(posts)
      }
      console.log(data);
      fetchAllPosts();
    },
    [fetchAllPosts]
  );

  useEffect(() => {
    fetchAllPosts();
  },[]);

  // useEffect(() => {
  //   fetchAllPosts();
  // }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className=" h-screen w-screen ">
        <div>
          👋Hi <span className="text-blue-300">{userName}</span>
        </div>
        <form onSubmit={postHandle} className="flex flex-col items-center justify-center gap-3" method="POST" enctype="multipart/form-data" action="">
          <textarea onChange={editHandle} value={edit} name="description" className=" border-2 text-black rounded-md w-[60%] mt-3 outline-none m-auto " id=""></textarea>
          <input className=" m-auto " type="file" name="fileName" />
          <button disabled={!edit} type="submit" className={`bg-blue-400  text-white font-bold py-1 px-2 rounded  ${edit ? " bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded" : " "}`}>
            Post
          </button>
        </form>
        <div className="mt-5 p-2 flex flex-col gap-4 items-center text-center">
          <div className="border w-[200px] p-2 leading-tight rounded-md">
            <Link to={"/profile"} className="font-bold text-blue-400 text-start mb-2">
              @user
            </Link>
            <p>div Lore meexerci tation em illum molestias nisi aperiam rerum tempora.</p>
            <img className="w-[150px] h-[200px] rounded-lg mt-3 m-auto" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
            <div className="text-red-500 cursor-pointer">
              <FaHeart />
            </div>
          </div>
          {posts?.map((post, index) => {
            return (
              <div className="border w-[200px] p-2 leading-tight rounded-md" key={index}>
                <Link to={"/profile"} className="font-bold text-blue-400 text-start mb-2">
                  @{post.user.username}
                </Link>
                <p>{post.post}</p>
                <div className="flex justify-between px-3">
                  <div onClick={() => fetchLikePost(post._id)} className={` ${post.liked.indexOf(userId) >= 0?'text-red-500': 'text-white'} flex gap-1 items-center cursor-pointer duration-200 active:scale-125`}>
                    <FaHeart />{post.liked.length}
                  </div>
                  <div className=" cursor-pointer hover:text-red-300 duration-200 active:scale-125">{userId == post.user._id && <MdDeleteForever onClick={() => deletePost(post._id)} />}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Posts;
