/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const JwtController = require('./JwtController');

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
    
        return res.status(200).json({ message: 'Registracija je uspješna.' });
    },

    login: async function (req, res) {
        const { korime, lozinka } = req.body;

        if(!korime || !lozinka) {
            return res.status(401).json({ error: 'Korisničko ime i lozinka su obavezni!' });
        }

        const user = await Korisnik.findOne({ korime: korime });

        if (!user) {
            return res.status(401).json({ error: 'Korisničko ime ili lozinka su neispravni!' });
        }

        const passwordMatch = await bcrypt.compare(lozinka, user.lozinka);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Korisničko ime ili lozinka su neispravni!' });
        }
        
        const token = JwtController.createToken(user.id, user.korime, user.tip_korisnika_id);
        
        if(!token) {
            return res.status(500).json({ error: 'Greška kod kreiranja JWT!' });
        }
        
        return res.status(200).json({ id: user.id, korime: user.korime, token, message: 'Prijava je uspješna.' });
    }
};

