
const Profile = () => {
  return (
    <>
     <div className="h-screen w-screen flex flex-col items-center justify-center">
       <h1>Name</h1>
       <p>email</p>
<br /><hr />
<div className="mt-5 p-2 text-blue-400">All Posts from this user 👇</div>
       <div className="mt-5 p-2 flex flex-col gap-4 items-center text-center">
              <div className="border w-[200px] p-2 leading-tight rounded-md">
                <p>div Lore meexerci tation em illum molestias nisi aperiam rerum tempora.</p>
              </div>
        </div>
     </div>
    </>
  )
}
export default Profile