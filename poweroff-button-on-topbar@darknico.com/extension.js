/*--------------------------------------*/
/*  Poweroff Button on Topbar           */
/*  ==================================  */
/*  GNOME Shell Extensions              */
/*  Darknico - http://www.darknico.com  */
/*--------------------------------------*/

import St from 'gi://St';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class PoweroffButtonExtension extends Extension {
    enable() {
        this._icon = new St.Icon({
            icon_name: 'system-shutdown',
            style_class: 'system-status-icon'
        });

        this._button = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            track_hover: true
        });

        this._button.set_child(this._icon);
        this._button.connect('button-press-event', this._poweroff.bind(this));

        Main.panel._rightBox.insert_child_at_index(this._button, -1);
    }

    disable() {
        Main.panel._rightBox.remove_child(this._button);
        if (this._icon) {
            this._icon.destroy();
            this._icon = null;
        }
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
    }

    _poweroff() {
        try {
            let proc = Gio.Subprocess.new(
                ['systemctl', 'poweroff'],
                Gio.SubprocessFlags.NONE
            );
            proc.wait_async(null, null);
        } catch (err) {
            Main.notify('Poweroff Error', String(err));
        }
    }
}
