import{ createRouter, createWebHistory, createMemoryHistory, createWebHashHistory } from 'vue-router'
import { useOda } from "./store/oda.js"

// Pages
import Intro from './pages/intro.vue'
import Activity from './pages/activity.vue'
import End from './pages/end.vue'
import Loading from './pages/loading.vue'
import ErrorPage from './pages/errorPage.vue'
import NoOda from './pages/noOda.vue'
import Freeze from './pages/freeze.vue'

const odaID = (to) => {
    const oda = useOda()
    if(to.params.odaID)
        oda.setOdaID(to.params.odaID)
    if(to.params.studentData)
        oda.setUserData(to.params.studentData)
    return {path:'/loading'}
}


const FreezeStudent = (to) => {
    const oda = useOda()
    oda.setOdaID(to.params.odaID)
    oda.setUserData(to.params.studentData)
    return {path:'/freeze'}
}
const FreezeStudentTeacher = (to) => {
    const oda = useOda()
    oda.setOdaID(to.params.odaID)
    oda.setUserData(to.params.studentData)
    if(to.params.teacherData){
        oda.setTeacherData(to.params.teacherData)
    } else {
        oda.setTeacherData("e30=")
    }
    return {path:'/freeze'}
}
const FreezeStudentFreezeTeacher = (to) => {
    const oda = useOda()
    oda.setOdaID(to.params.odaID)
    oda.setUserData(to.params.studentData)
    if(to.params.teacherData){
        oda.setTeacherData(to.params.teacherData)
    } else {
        oda.setTeacherData("e30=")
    }
    oda.teacherFreeze = true
    return {path:'/freeze'}
}


const routes = [
    {path:'/freeze', component: Freeze },

    {path:'/intro', component: Intro },
    {path:'/activity', component: Activity },
    {path:'/activity/:scene', component: Activity },
    {path:'/end', component: End },
    {path: '/error', component: ErrorPage },
    {path: '/loading', component: Loading },
    {path: '/', component: NoOda }, 
    //odas
    {path: '/:odaID', redirect: odaID },
    {path: '/:odaID/:studentData', redirect: odaID },
    //freeze
    {path: '/:odaID/freeze/:studentData', redirect: FreezeStudent },
    {path: '/:odaID/freeze/:studentData/teacher', redirect: FreezeStudentTeacher },
    {path: '/:odaID/freeze/:studentData/teacher/:teacherData', redirect: FreezeStudentTeacher },
    {path: '/:odaID/freeze/:studentData/teacher/freeze/:teacherData', redirect: FreezeStudentFreezeTeacher },
];



const router = createRouter({
    //history: createMemoryHistory(),
    //history: createWebHistory('/riodas'),
    history: createWebHashHistory(),

    routes
})

router.beforeEach(async to => {

    
    const oda = useOda()

    if(to.path!='/loading' && to.path!='/error'){
        // ODA NOT LOADED ALREADY
        
        if(!oda.loaded){
            router.push('/loading')
        }
        // SAVE USER LOCATION
        if(oda.user){
            oda.user.location = to.path
        }
    }

})



export default router;