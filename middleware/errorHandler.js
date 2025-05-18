export const errorHandler = (err, req, res, next) => {
  console.error(" Error:", err.stack);
  res.status(500).render("users/page404", {
    title: "Something went wrong",
    message: err.message || "Internal Server Error",
  });
};
