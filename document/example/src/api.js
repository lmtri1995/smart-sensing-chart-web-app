import CallAPI from "./services/axios-API";
const people = [
    { name: 'Nader', age: 36 },
    { name: 'Amanda', age: 24 },
    { name: 'Jason', age: 44 }
  ]
const  GridLayout = [
    {i: "0", x: 0, y: 0, w: 3, h: 10,type:"Doughnut"},
    {i: "1", x: 0, y: 1, w: 3, h: 10,type:"Line"},
    {i: "2", x: 0, y: 2, w: 3, h: 10,type:"Bar"}
  ]  
  export default () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(people)
      }, 3000)
    })
  }
  export function gridLayout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(GridLayout)
      }, 300)
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