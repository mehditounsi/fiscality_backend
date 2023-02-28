module.exports = ({
    knex = {},
    name = 'name',
    tableName = 'tablename',
    selectableProps = [],
    timeout = 1000,
}) => {

    const create = async (props) => {
        try {
            let rs = await knex.insert(props).into(tableName).returning(selectableProps).timeout(timeout);
            if (rs && rs.length > 0) {
                return rs[0]
            }
            return null
        } catch (error) {
            console.error(error)
        }
    }

    const findAll = async () => {
        let all = await knex.select(selectableProps).from(tableName).timeout(timeout);
        return all
    }

    
    const find = async (filters) => {
        let find =  await knex.select(selectableProps).from(tableName).where(filters).timeout(timeout);
        return find 
    }

    const findOne = async (filters) =>{
        try {
            let findOne = await find(filters)

            return findOne[0]
        } catch (error) {
            console.error(error)
        }
    }
        

    const findByName = async (role) => {
        return await knex.select(selectableProps).from(tableName).where({ role }).timeout(timeout);
    };

    const findById = async (id) => {
        let rs = await knex.select(selectableProps).from(tableName).where({ id }).timeout(timeout);
        if (rs && rs.length > 0) {
            return rs[0]
        }
        return null
    };

    const update = async (id, props) => {
        try {
            delete props.id;
            let condition = {
                id: id
            }
            let rs = await knex
                .update(props)
                .from(tableName)
                .where(condition)
                .returning(selectableProps)
                .timeout(timeout);
                if (rs && rs.length > 0) {
                    return rs[0]
                }
                return null
        } catch (error) {
            console.log(error);
        }
    };

    const destroy = async (id) => {
        let condition = {
            id: id
        }
        let rs = await knex.del().from(tableName).where(condition).returning(selectableProps).timeout(timeout);
        if (rs && rs.length > 0) {
            return rs[0]
        }
        return null
    };
    return {
        name,
        tableName,
        selectableProps,
        timeout,
        create,
        findAll,
        find,
        findOne,
        findById,
        findByName,
        update,
        destroy
    };
}
