function status(request, response) {
  response.status(200).json({ "API Endpoint": "Status" });
}

export default status;
