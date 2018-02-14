<template>
    <Modal :isOpen="model" @onSubmit="submit">

        <h3 slot="header" class="modal-title">Согласовать встречу</h3>

        <div slot="content">
            Вы действительно хотите согласовать эту встречу?
        </div>

        <div slot="footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Отмена</button>
            <button type="submit" class="btn btn-success">Согласовать</button>
        </div>

    </Modal>
</template>

<script>
    import Modal from '@/Modal'

    export default {
        components: {
            Modal,
        },
        props: ['model', 'onSubmit', 'onClose'],
        methods: {
            close () {
                this.$emit('onClose')
            },
            submit () {
                console.log('submit')
                this.$emit('onSubmit', this.model)
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>