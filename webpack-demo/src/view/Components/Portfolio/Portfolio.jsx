import m from 'mithril'

import './_portfolio.scss'
import calm from '../../../images/image 50.png'
import automation from '../../../images/image 49.png'
import airtable from '../../../images/image 39.png'

export class Portfolio{
    view() {
        return(
            <div class='portfolio_area'>
                <div class='portfolio_title'>Portfolio</div>
                <div class='portfolio_content_area_row'>
                    <div class='portfolio_calm'>
                        <img src={ calm } class='portfolio_calm_img'/>
                    </div>
                    <div class='portfolio_calm'>
                        <img src={ automation } class='portfolio_automation_img'/>
                    </div>
                    <div class='portfolio_calm1'>
                        <img src={ airtable } class='portfolio_airtable_img'/>
                        <div class='portfolio_airtable_text'>is a cloud-based software company that offers an easy-to-use online platform for creating and sharing  databases.</div>
                    </div>
                </div>
                <div class='portfolio_content_area_row'>
                    <div class='portfolio_calm'>
                        <img src={ calm } class='portfolio_calm_img'/>
                    </div>
                    <div class='portfolio_calm'>
                        <img src={ automation } class='portfolio_automation_img'/>
                    </div>
                    <div class='portfolio_calm'>
                        <img src={ airtable } class='portfolio_airtable_img'/>
                    </div>
                </div>
                <div class='portfolio_content_area_row'>
                    <div class='portfolio_calm'>
                        <img src={ calm } class='portfolio_calm_img'/>
                    </div>
                    <div class='portfolio_calm'>
                        <img src={ automation } class='portfolio_automation_img'/>
                    </div>
                    <div class='portfolio_calm'>
                        <img src={ airtable } class='portfolio_airtable_img'/>
                    </div>
                </div>
            </div>
        )
    }
}