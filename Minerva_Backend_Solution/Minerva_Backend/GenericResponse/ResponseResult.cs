namespace Minerva_Backend.GenericResponse
{
    public class ResponseResult<T>
    {
        public T? Data { get; set; }
        public string? Message { get; set; }
        public bool Status { get; set; } = false;
        public ResponseResult<T> Success(T? data, string message, bool status)
        {
            return new ResponseResult<T>
            {
                Data = data,
                Message = message,
                Status = true
            };
        }

        public ResponseResult<T> Error(T? data, string message, bool status)
        {
            return new ResponseResult<T>
            {
                Data = data,
                Message = message,
                Status = false,

            };
        }
    }
}
