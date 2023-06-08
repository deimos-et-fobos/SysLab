import { fetchServer } from "./AuthServer";

export const _hasPerms = (perms, req_perms) => {
  let hasPerms = {};
  Object.keys(req_perms).forEach( key => { 
    hasPerms[key] = req_perms[key].every( perm => perms.includes(perm));
  });
  return hasPerms;
}

export const getInitialValues = async(url, id, initialValues, setMsg, setInitialValues) => {
  if (id) {
    fetchServer('GET', url + `${id}/`, null, (res, status) => {
      if (status === 200) {
        Object.keys(res).forEach(
          (key) => { (res[key] === null) ? res[key] = initialValues[key] : null; }
        );
        setInitialValues(res);
      } else {
        res.detail ? setMsg({msg: res.detail , severity:'error'}) : null;
        console.error( res.detail ? res.detail : null)
        setInitialValues(initialValues);
      }
    });
  } else {
    setInitialValues(initialValues);
  }
}
