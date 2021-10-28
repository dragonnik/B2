import m from 'mithril';

import './_header.scss'
import logo from '../../../images/Vector.png'
import global from '../../../images/Group.png'
import buildings from '../../../images/scott-webb-fp4y6MkKyc4-unsplash 1.png'
import arrow from '../../../images/Vector1.png'

export class Header{
    view(){
        return(
            <div class='header_area'>
                <div class='header'>
                    <div class='empty1'></div>
                    <div class='logo_area'>
                        <img src={ logo } class='logo_img'/>
                        <img src={ global } class='logo_name'/>
                    </div>
                    <div class='empty'></div>
                    <div class='links_area'>
                        <div class='border'>Home</div>
                        <div class='links_light'>About us</div>
                        <div class='links_light'>Sectors</div>
                        <div class='links_light'>Team</div>
                        <div class='links_light'>Portfolio</div>
                    </div>
                    <div class='empty1'></div>
                </div>
                <div class='blog1_area'>
                    <div class='blog1_content'>
                        <div class='title'>Investments focused on Growth</div>
                        <div class='content'>We provide growth capital to later stage ventures in all sectors of technology</div>
                        <div class='button_area'>
                            <div class='button_content'>Portfolio</div>
                            <img src={ arrow } class='button_arrow'/>
                        </div>
                    </div>
                    <img src={ buildings } class='buildings'/>
                </div>
            </div>
        )
    }
}