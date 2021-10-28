import m from 'mithril'

import './_about_us.scss'
import picture from '../../../images/11063.png'

export class AboutUs{
    view() {
        return (
            <div class='main_area'>
                <div class='text_area'>
                    <div class='title_about_us'>About us</div>
                    <div class='content_about_us'>
                        2B Global Capital is a private investment firm. It was founded by Mr. Berik Kaniyev, who is one of the shareholders and Chairman of the Board of Lancaster Group. 
                        2B Global Capital provides growth capital to later stage ventures in all sectors of technology. We look for companies with growing recurring revenues that have innovative products solving real customer problems, positive unit economics and great management teams.
                    </div>
                </div>
                <img src={ picture } class='about_us_photo'/>
            </div>
        )
    }
}