import CallAPI from "./services/axios-API";
const people = [
    { name: 'Nader', age: 36 },
    { name: 'Amanda', age: 24 },
    { name: 'Jason', age: 44 }
  ]
  
  export default () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(people)
      }, 3000)
    })
  }
//   export const actSendMonotorListPost = (params) =>{ 
//     let header= { 'content-type': 'multipart/form-data'}
//         return CallAPI('server/monitor/applyAllChanges','POST',params,header).then(res =>{
//             let response = res.data;            
//            return res;            
//         }).catch((err)=>{
//           console.log(err)
//         });
// }