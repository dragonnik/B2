import m from 'mithril'

import './_footer.scss'
import logo_white from '../../../images/2B_Global-Final_Full-Horizontal-Circle-White 1.png'

export class Footer{
    view() {
        return(
            <div class='footer_area'>
                <div class='footer_content_area'>
                    <div class='footer_logo_white_area'>
                        <img src={ logo_white } class='footer_logo_white'/>
                    </div>
                    <div class='footer_content'> 
                        52-54 Avenue du X Septembre<br/>
                        L-2550 Luxembourg<br/><br/>
                        info@2bgc.vc
                    </div>
                </div>
                <div class='footer_stroke'></div>
            </div>
        )
    }
}