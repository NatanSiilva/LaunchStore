const User = require('../models/User')

const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')


module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },

    login(req, res) {
        req.session.userId = req.user.id
        return res.redirect("/users")
    },

    logout(req, res) {
        req.session.destroy() //destroi a session do usuario
        return res.redirect("/")
    },

    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },

    async forgot(req, res) {

        const user = req.user

        try {
            // Um token para esse usuário, guardoms o tohen na tabela do user
            const token = crypto.randomBytes(15).toString("hex")

            // criar limete de tempo para expiração do token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // enviar um email de verificação com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'igrejaplenitudeevida@gmail.com',
                subject: 'Recuperação de senha',
                html: `
                    <h2>Perdeu a chave ?</h2>
                    <p>
                        Não se preocupe, clique no link abaixo para recuperar a sua senha.
                    </p>
                    <p>
                        <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                            Recuperar Senha
                        </a>
                    </p>
                `

            })

            // avisar o usuário que enviamos o email    
            return res.render("session/forgot-password", {
                success: "Verificar seu email para resetar sua senha."
            })    
            
        } catch (error) {
            console.error(error)
            return res.render("session/forgot-password", {
                error: "Error inesperado, tente novamente!"
            })    
        }
    },

    resetForm(req, res) {
        return res.render("session/password-reset", { token:req.query.token })
    },

    async reset(req, res) {
        const  user  = req.user
        const { password, token }  =  req.body
        

        try {
            // criar umnovo hash de senha
            const newPassword = await hash(password, 8)

            // atualizar o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            // avisa o usuário que ele tem uma nova senha
            return res.render("session/login", {
                User: req.body,
                success: "Senha atualizada! Faça o seu login."
            })
            
        } catch (error) {
            console.log(error)
            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Error inesperado, tente novamente!"
            })  
        }
    }

}   