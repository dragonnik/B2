import m from 'mithril'

import { Header } from './Header/Header.jsx'
import { AboutUs } from './About us/About_us.jsx'
import { Sectors } from './Sectors/Sectors.jsx'
import { Team } from './Team/Team.jsx'
import { Portfolio } from './Portfolio/Portfolio.jsx'
import { Footer } from './Footer/Footer.jsx'

export class App {
    view(){
        return (
            <div>
                <Header/>
                <AboutUs/>
                <Sectors/>
                <Team/>
                <Portfolio/>
                <Footer/>
            </div>
        )
    }
}