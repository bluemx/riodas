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
import Builder from './pages/builder.vue'

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
    oda.setUserData("e30=")
    oda.setFreeze()
    return {path:'/loading'}
}
const FreezeStudentTeacher = (to) => {
    const oda = useOda()
    oda.setOdaID(to.params.odaID)
    oda.setUserData("e30=")
    oda.setTeacherData("e30=")
    oda.setFreeze()
    return {path:'/loading'}
}
const FreezeStudentFreezeTeacher = (to) => {
    
    const oda = useOda()
    oda.setOdaID(to.params.odaID)
    oda.setUserData("e30=")
    oda.setTeacherData("e30=")
    oda.setFreeze()
    oda.teacherFreeze = true
    return {path:'/loading'}
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
    {path: '/:odaID/freeze', redirect: FreezeStudent },
    {path: '/:odaID/freeze/teacher', redirect: FreezeStudentTeacher },
    {path: '/:odaID/freeze/teacher/freeze', redirect: FreezeStudentFreezeTeacher },
    //builder
    {path: '/builder', component: Builder },
];



const router = createRouter({
    //history: createMemoryHistory(),
    //history: createWebHistory('/riodas'),
    history: createWebHashHistory(),

    routes
})

router.beforeEach(async to => {


    const oda = useOda()

    if(to.path!='/loading' && to.path!='/error' && to.path!='/builder'){
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