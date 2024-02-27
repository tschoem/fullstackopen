const NewBlogForm = ({ handleSubmit }) => (
  <>
    <h2>create new</h2>
    <form onSubmit={handleSubmit} >
      <div>
        title
        <input
          type="text"
          name="title"
        />
      </div>
      <div>
        author
        <input
          type="text"
          name="author"
        />
      </div>  
      <div>
        url
        <input
          type="text"
          name="url"
        />
      </div>   
      <button>create</button>
    </form>
  </>
)

export default NewBlogForm