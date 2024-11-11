export function updateFilterPagination (req: any) {
  if(!req.page || req.page == 0){
    req.page = 1
  }
  if(!req.pageSize){
    req.pageSize = 20;
  }
  req.startIndex = (req.page - 1) * req.pageSize;

  return req
}