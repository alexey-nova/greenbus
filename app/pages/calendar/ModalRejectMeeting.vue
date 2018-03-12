<template>
    <Modal :isOpen="model" @onSubmit="submit">

        <h3 slot="header" class="modal-title">Отказаться от встречи</h3>

        <div slot="content">
            Вы действительно хотите отказаться от встречи?
        </div>

        <div slot="footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Отмена</button>
            <button type="submit" class="btn btn-danger">Отказать</button>
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
                this.$emit('onSubmit', this.$props.model)
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>