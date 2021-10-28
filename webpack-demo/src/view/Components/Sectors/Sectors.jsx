import m from 'mithril'

import './_sectors.scss'
import robot from '../../../images/Rectangle 42.png'
import pc from '../../../images/Rectangle 44.png'
import security from '../../../images/Rectangle 46.png'
import financial from '../../../images/Rectangle 48.png'

export class Sectors{
    view() {
        return(
            <div class='sectors_area'>
                <div class='title_sectors'>Sectors</div>
                <div class='sectors_content_area'>
                    <div class='artificial_intelligence_area'>
                        <img src={ robot } class='sectors_photo'/>
                        <div class='artificial_intelligence_content_area'>
                            <div class='artificial_intelligence_content'>
                                Artificial intelligence
                            </div> 
                        </div>
                        <img src={ pc } class='sectors_photo'/>
                        <div class='artificial_intelligence_content_area'>
                            <div class='artificial_intelligence_content1'>
                                Software
                            </div> 
                        </div>
                    </div>
                    <div class='cyber_secutity_area'>
                        <img src={ security } class='sectors_photo'/>
                        <div class='cyber_secutity_content_area'>
                            <div class='cyber_secutity_content1'>
                                Cyber secutity
                            </div>
                        </div>
                        <img src={ financial } class='sectors_photo'/>
                        <div class='cyber_secutity_content_area'>
                            <div class='cyber_secutity_content'>
                                Financial technology
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}