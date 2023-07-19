/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');

module.exports = {
    register: async function (req, res) {
        const { ime, prezime, korime, email, lozinka } = req.body;
    
        const existingUsername = await Korisnik.findOne({ korime: korime });
        const existingEmail = await Korisnik.findOne({ email: email });
        if (existingUsername) {
            return res.status(400).json({ error: 'Korisnik s tim korisničkim imenom već postoji!' });
        }
        if (existingEmail) {
            return res.status(400).json({ error: 'Taj email je već registriran!' });
        }
    
        const saltRounds = 10;
        const sol = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(lozinka, sol);
    
        const newUser = await Korisnik.create({ ime, prezime, korime, email, lozinka: hash, sol, tip_korisnika_id: 2 }).fetch();
    
        return res.json({ message: 'Registracija je uspješna!' });
      }
};

